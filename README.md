# Minesweeper - OOP 
Minesweeper clone built with JavaScript + jQuery + HTML + CSS, using Object Oriented Programming (OOP) paradigm.

Try it out! https://minesweeper-clone.vercel.app/

## Motivation
I chose a simple minesweeper build as an opportunity to explore OOP paradigm, in contrast to my previous projects that followed the imperative paradigm. The code is centered on one class template 'Minesweeper'. 


## Code Overview
Two particular methods inside the class deserve a closer look: initSquareNumber() and revealBlanks().

### initSquareNumber()
After randomly filling up the board with mines, we need to perform two tasks for each non-mine square:
1. Check how many mines are in the squares around it (neighboring squares that are one-square away).
2. Assign the number of mines (0-8) into it.

### revealBlanks
A particular behavior found in Minesweeper is that by clicking an empty square (square numbered 0), the player will reveal all the neighboring squares that are also empty, if any. A function that is somewhat recursive might be needed to perform this behavior. 
