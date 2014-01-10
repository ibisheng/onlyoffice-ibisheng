CGroupShape.prototype.addToRecalculate = function()
{
    if(this.drawingObjects && this.drawingObjects.controller)
    {
        this.drawingObjects.controller.objectsForRecalculate[this.Id] = this;
    }
};