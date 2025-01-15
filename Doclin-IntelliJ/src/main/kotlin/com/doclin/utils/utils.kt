package com.doclin.utils

import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager

object ProjectUtils {

    fun getCurrentProjectName(): String? {
        val project: Project? = ProjectManager.getInstance().openProjects.firstOrNull()
        return project?.name
    }

    fun getCurrentProject(): Project? {
        return ProjectManager.getInstance().openProjects.firstOrNull()
    }
}