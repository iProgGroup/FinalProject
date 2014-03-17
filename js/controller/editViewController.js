/* 
 * @author Gigi
 * @desc this is the controller for EditView
 */

var EditViewController = function(view, model) {
	/*remove the defulte streched out style of left menu when click or mouse over*/
	$(".catgories").on("click mouseout", function() {
		$("#icon_bg div").attr("id", "cat_bgs");
		$("#icon_bg img").attr("id", "");
	});

	// Handling original draggable
	$(".draggable_item").draggable({
		helper: 'clone',
		containment: "document",
//		revert: true,
//		delay: 0,
//		grid: false
	});

	// Handling cloned draggable
	$(".dropped_item").draggable({
		containment: "#droppable_canvas"
	});

	// Handling droppable
	$("#droppable_canvas").droppable({
		hoverClass: "canvas-hover",
		drop: function(event, ui) {
			var draggableObj = $(ui.draggable);
			var draggablePos = $(ui.helper).offset();
			var canvasPos = $(this).offset();

			// Convert draggable offset pos to canvas-relative pos
			var relPosInPercent = {
				'left': (draggablePos.left - canvasPos.left) / $(this).width() * 100,
				'top': (draggablePos.top - canvasPos.top) / $(this).height() * 100
			};

			// item is dropped outside the canvas, break.
			//TOFIX: handled components dropped on the right edge of the canvas
			if ((relPosInPercent >= 0 && relPosInPercent <= 100)) {
				return;
			}

			// Update position of component in model
			
//				alert($(draggableObj).attr("class"));
			if ($(draggableObj).hasClass("dropped_item")) {
				var pageComponent = view.curStoryPage.getComponentById(draggableObj.attr("pb-id"));
				if(!pageComponent){
					return;
				}
				pageComponent.setPos(relPosInPercent.left, relPosInPercent.top);
				
				return;
			}

			// Save new component to model
			var componentType = Number($(draggableObj).attr("pb-type"));
			var componentId;
			switch (componentType) {
				case PageComponent.TYPE_BACKGROUND:
				case PageComponent.TYPE_ITEM:
					componentId = view.curStoryPage.addComponent(componentType, $(draggableObj).find('img').attr('src'), relPosInPercent.left, relPosInPercent.top);
					break;
				case PageComponent.TYPE_TEXT:
					break;
			}

			// Clone element to the canvas for newly added item
			var element = $(draggableObj).clone();
			$(element).removeClass().addClass("dropped_item");
			$(element).css({
				"left": relPosInPercent.left + "%",
				"top": relPosInPercent.top + "%"
			});
			// Keep component id in the element (for updating component later)
			element.attr("pb-id", componentId);
			// Also add delete button
			element.append($('<input type="button" class="btn btn-xs" name="delete" value="x" />'));


			// Add to canvas
			$(this).append(element);

			// Add other event hanlders to this new element
			element.draggable({
				containment: "#droppable_canvas"
			});
		},
		// Below is to hanle "draggable clone was covered by canvas when first dragged"
		activate: function(event, ui) {
			$(this).css("zIndex", -10);
		},
		deactivate: function(event, ui) {
			$(this).css("zIndex", "");
		}
	});


};

