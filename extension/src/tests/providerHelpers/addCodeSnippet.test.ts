import * as vscode from 'vscode';
import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { addCodeSnippet } from '../../providerHelpers/addCodeSnippet';
import * as gitProviderUtil from '../../utils/gitProviderUtil';
import * as authenticationProviderHelper from '../../providerHelpers/authenticationProviderHelper';
import * as readDoclinFile from '../../providerHelpers/doclinFile/readDoclinFile';
import { handleGetSidebarLoadingStatus } from '../../utils/waitForSidebarToShow';
import { SidebarLoadingStatus } from '../../enums';
import * as activeEditorRelativeFilePath from '../../providerHelpers/doclinRelativeFilePath';

suite('Testing addCodeSnippet', () => {
  let webviewView: vscode.WebviewView;
  let sandbox: SinonSandbox;
  let executeCommandStub: SinonStub;
  let activeTextEditorStub: SinonStub;
  let getTextStub: SinonStub;
  let getGitBranchStub: SinonStub;
  let postMessageStub: SinonStub;
  let getAuthenticatedUserStub: SinonStub;
  let readDoclinFileStub: SinonStub;
  let getDoclinRelativeFilePathStub: SinonStub;

  setup(() => {
    sandbox = createSandbox();
    executeCommandStub = sandbox.stub(vscode.commands, 'executeCommand');
    activeTextEditorStub = sandbox.stub(vscode.window, 'activeTextEditor');
    getTextStub = sandbox.stub();
    getGitBranchStub = sandbox.stub(gitProviderUtil, 'getGitBranch');
    postMessageStub = sandbox.stub();
    getAuthenticatedUserStub = sandbox.stub(authenticationProviderHelper, 'getAuthenticatedUser');
    readDoclinFileStub = sandbox.stub(readDoclinFile, 'readDoclinFile');
    getDoclinRelativeFilePathStub = sandbox.stub(activeEditorRelativeFilePath, 'getDoclinRelativeFilePath');

    webviewView = {
      webview: {
        postMessage: postMessageStub,
      },
      visible: true,
    } as unknown as vscode.WebviewView;
  });

  teardown(() => {
    sandbox.restore();
  });

  test('should execute the command to open the doclin sidebar view', async () => {
    await addCodeSnippet(webviewView);

    expect(executeCommandStub.calledWith('workbench.view.extension.doclinSidebarView')).to.be.true;
  });

  test('should populate code snippet in the sidebar if there is an active text editor', async () => {
    getTextStub.returns('originalSnippet');
    getGitBranchStub.resolves('gitBranch');
    getAuthenticatedUserStub.resolves({ username: 'testuser' });
    getDoclinRelativeFilePathStub.resolves('filePath');
    readDoclinFileStub.resolves({
      organizationId: 'test-id',
      projectId: 54,
    });

    activeTextEditorStub.get(() => ({
      document: {
        getText: getTextStub,
      },
      selection: {
        start: {
          line: 1,
        },
      },
    }));

    handleGetSidebarLoadingStatus(SidebarLoadingStatus.LOADING_COMPLETE);
    await addCodeSnippet(webviewView);

    expect(readDoclinFileStub.calledOnce).to.be.true;
    expect(getAuthenticatedUserStub.calledOnce).to.be.true;
    expect(getTextStub.calledTwice).to.be.true;
    expect(getGitBranchStub.calledOnce).to.be.true;
    expect(
      postMessageStub.calledWithMatch({
        type: 'populateCodeSnippet',
        value: {
          filePath: 'filePath',
          lineStart: 2,
          originalSnippet: 'originalSnippet',
          gitBranch: 'gitBranch',
        },
      })
    ).to.be.true;
  });

  test('should not populate code snippet in the sidebar if there is no active text editor', async () => {
    activeTextEditorStub.get(() => undefined);

    await addCodeSnippet(webviewView);

    expect(readDoclinFileStub.called).to.be.false;
    expect(getAuthenticatedUserStub.called).to.be.false;
    expect(getTextStub.called).to.be.false;
    expect(getGitBranchStub.called).to.be.false;
    expect(postMessageStub.called).to.be.false;
  });

  test('should return early if the user is not logged in', async () => {
    activeTextEditorStub.get(() => ({
      document: {
        getText: getTextStub,
      },
      selection: {
        start: {
          line: 1,
        },
      },
    }));

    getAuthenticatedUserStub.resolves(undefined);

    await addCodeSnippet(webviewView);

    expect(readDoclinFileStub.called).to.be.false;
    expect(getAuthenticatedUserStub.calledOnce).to.be.true;
    expect(getTextStub.called).to.be.false;
    expect(getGitBranchStub.called).to.be.false;
    expect(postMessageStub.called).to.be.false;
  });
});
