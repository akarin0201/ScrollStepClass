# ScrollStepClass
A small script that adds css step classes depending on scroll value

## Usage

### In HTML

Add a css class defined in ScrollStepClass.js (scrollStepNodeClass variable, default 'ssn')
Define css class that should be added with each step with **data-ssn-class** attribute
Define amount of steps to be taken with **data-ssn-steps** attribute
Define step threshold with **data-ssn-threshold** attribute (measured in pixels)

### In CSS

Define step classes (by default the step class name is *data-ssn-class*-step-*step* for example: *scroll-action-step-1*)

## To do

The script is quite crude and I want to rebuild it & make it easier to configure soon™ 