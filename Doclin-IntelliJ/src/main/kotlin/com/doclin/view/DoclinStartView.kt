package com.doclin.view

import javax.swing.*
import java.awt.BorderLayout

class DoclinStartView : JPanel() {

    init {
        layout = BorderLayout()

        val titleLabel = JLabel("Doclin Start")
        titleLabel.horizontalAlignment = SwingConstants.CENTER
        add(titleLabel, BorderLayout.NORTH)

        // Add any other components you need for the start view
        val contentPanel = JPanel()
        contentPanel.layout = BoxLayout(contentPanel, BoxLayout.Y_AXIS)

        val welcomeLabel = JLabel("Welcome to Doclin!")
        contentPanel.add(welcomeLabel)

        add(contentPanel, BorderLayout.CENTER)

        val someButton = JButton("Do Something")
        add(someButton, BorderLayout.SOUTH)
    }
}