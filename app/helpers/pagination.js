/**
 * @param {int} total Number of pages
 * @param {int} current The page currently being shown
 * @param {int=} [buttonCount=7]
 *   How many page button to display from left-to-right.
 *   Odd numbers wil produce nicer looking, even sided, UI.
 * @return {Object}
 */
module.exports = function(total, current, buttonCount)
{
    buttonCount = buttonCount || 7; //default to seven

    // if the button count is MORE than the actual pages avaiable,
    // set the button count to the pages avaialble
    buttonCount = buttonCount < total ? buttonCount : total;
    var middleCount = Math.floor(buttonCount / 2);

    var min = current - middleCount;
    var max = current + middleCount;

    if (min < 1)
    {
        min = 1;
        max = buttonCount;
    }

    if (max > total)
    {
        max = total;
        min = total - buttonCount + 1;
    }

    // Create an array of page numbers to display
    // in the current page's pagination UI. 
    var pages = [];
    while (min <= max)
    {
        pages.push(min);
        min++;
    }
    
    return {
        //template will need current to set .active CSS, etc.
        current: current,
        total: total,
        pages: pages
    };
};