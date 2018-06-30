# Interactive Tutorial
I recently stumbled upon the necessity to make an interactive tutorial for a website and decided to write my own instead.

This is **not at all intended for actual use**, mainly because of the limitations on browser compatibility. It is just an exercise and the code I wrote is surely not perfect, but if you want to make it better, go ahead!

## Compatibility
The main issue with compatibility is the CSS property `clip-path`, which is currently (june 2018) fully supported in Firefox only. Chrome and Safari support it with the `-webkit-` prefix.

[Here](https://caniuse.com/#search=clip-path)  is the compatibility situation as of june 2018.

## Parameters
```javascript
 {
 	tutorialElements: Array,
 	confirmBtn: Boolean, //default: false
 	preventDefault: Boolean, //default: false
 	theme: String (theme name), //default:'it_theme__green'
	tutorialEndCallback: function
 }
```

### tutorialElements (Array)

```javascript
	tutorialElements: [
		{
			id: String, //The element ID, without the css selector #
			ttipText: String, //The text that will be shown in the tooltip
			interactive: Boolean, //default 'true'
			confirmBtnText: String //default: 'OK'
		}
	];
```  
#### tutorialElements properties
| Property Name  | Type      |  Default value | Description |
| -------------  | --------- | -------------- | ------------|
| `id`             | String    | -			  |It should be the element id. The css selector # is **not** needed.
| `ttipText`       | String    | -			  |The text content of the tooltip for the element with id `id`.
| `interacive`     | Boolean   | false		  |	If the element hasn't got a 'click' event listener, `interactive` should be manually set to `true`. The tooltip for that element will be generated with a confirmation button.
| `confirmBtnText` | String    | OK			  |	The text for the confirmation button in the tooltip.
| `cb`             | Function  | - 			  |A callback function to be called right after the current step.



### confirmBtn (Boolean) - Optional

Default value: `false`.

If the element is interactive, clicking on it will mode the tutorial forward one step. If you would also like the tooltip to be interactive (with an 'OK' button), you can manually set it to true.


### preventDefault (Boolean) - Optional

Default value: `false`.

The default behaviour for the 'click' event on the element can be inhibited by setting `preventDefault: false`. All of the 'click' event listeners of the current element will be re-added in the next step of the tutorial.

### theme (String) - Optional

Default value: `'it_theme__dark'`.

### tutorialEndCallback (Function) - Optional

An optional callback function can be provided. It will be executed at the end of the tutorial.
```javascript
{
	tutorialEndCallback: function(){
    	console.log('Tutorial has ended!');
	}
    ...
}
```