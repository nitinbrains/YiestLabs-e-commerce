import SalesLib from './SalesLib';

var Store = (function() {

    var mainCategories = [0, 7, 8, 12, 13, 14, 15];
    var indicesLoaded = [];      // past
    var indicesToLoad = [];      // present

    /*
     * Determine which sales categories need to be loaded
     */
    function getClassFilters(index, getAll=false)
    {
        try
        {
            index = parseInt(index);
            var classFilters = [];
            var remainingIndices;

            // get all inventory
            if(getAll)
            {

                // get remaining indices that need to be fetched
                if(indicesLoaded)
                {
                    remainingIndices = mainCategories.filter(index => indicesLoaded.indexOf(index) < 0);
                }
                else
                {
                    remainingIndices = mainCategories;
                }

                if(remainingIndices.length > 0)
                {

                    for(var i = 0; i < remainingIndices.length; i++)
                    {

                        index = remainingIndices[i];

                        if(!indicesLoaded || indicesLoaded.indexOf(index) < 0)
                        {
                            classFilters.push(...SalesLib.SALESCATEGORY[index]);
                        }
                    }

                    indicesToLoad = remainingIndices;

                }
            }
            else if(!indicesLoaded || indicesLoaded.indexOf(parseInt(index)) < 0)
            {
                classFilters = SalesLib.SALESCATEGORY[index];
                indicesToLoad = [index];
            }

            return classFilters;    

        }
        catch(err){
            throw err;
        }

    }

    /*
     * After inventory has been loaded, add categories that were loaded to indicesLoaded
     * and reset indicesToLoad
     */
    function addIndicesLoaded(){
        
        indicesLoaded.push(...indicesToLoad);
        indicesToLoad = [];
        
    }

    return {
        getClassFilters: getClassFilters,
        addIndicesLoaded: addIndicesLoaded
    }

})();

export default Store;