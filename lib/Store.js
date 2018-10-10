import SalesLib from './SalesLib'
import Utils from './Utils'

var Store = (function() {

    var items = [];
    var mainCategories = [0, 7, 8, 12, 13, 14, 15];
    var categoriesLoaded = [];      // past
    var categoriesToLoad = [];      // present
    var selectedCategory = 0;


    function getSelectedCategory() {
        return selectedCategory;
    }

    function getItems() {
        return items;
    }

    function addItems(newItems) {
        items.push(...newItems);
    }

    /*
     * Determine which sales categories need to be loaded
     */
    function getClassFilters(category, getAll=false) {
        try
        {
            category = parseInt(category);
            var classFilters = [];
            var remainingCategories;

            // category is a subcategory, don't load inventory!!
            if(!mainCategories.includes(category)) {
                return null;
            }

            // get all items
            if(getAll) {

                // get remaining categories that need to be fetched
                if(categoriesLoaded) {
                    remainingCategories = mainCategories.filter(category => categoriesLoaded.indexOf(category) < 0);
                }
                else {
                    remainingCategories = mainCategories;
                }

                if(remainingCategories.length > 0) {

                    for(var i = 0; i < remainingCategories.length; i++) {

                        category = remainingCategories[i];

                        if(!categoriesLoaded || categoriesLoaded.indexOf(category) < 0) {
                            classFilters.push(...SalesLib.SALESCATEGORY[category]);
                        }
                    }

                    categoriesToLoad = remainingCategories;
                }

                // inventory already loaded
                else {
                    return null;
                }
            }
            else if(!categoriesLoaded || categoriesLoaded.indexOf(parseInt(category)) < 0) {
                classFilters = SalesLib.SALESCATEGORY[category];
                categoriesToLoad = [category];
            }
            // inventory already loaded
            else {
                return null;
            }

            return classFilters;    

        }
        catch(err){
            throw err;
        }

    }

    /*
     * After items has been loaded, add categories that were loaded to categoriesLoaded
     * and reset categoriesToLoad
     */
    function addCategoriesLoaded() {   
        categoriesLoaded.push(...categoriesToLoad);
        categoriesToLoad = [];
    }


    /*
     * Change main category
     * 
     * cannot unselect a category - can only switch to a new one
     */ 
    function selectMainCategory(categories, mainIndex, category) {

        for(var i = 0; i < categories.length; i++) {
            
            if(i == mainIndex) {

                // main category already chosen, don't switch categories
                if(categories[mainIndex].checked) {
                    return null
                }
                else {
                    categories[mainIndex].checked = true;
                }
            }
            else {
                categories[i].checked = false;
                if(categories[i].subCategories) {
                    categories[i].subCategories.forEach((subCategory, j) => {
                        categories[i].subCategories[j].checked = false;
                    })
                }
            }
        }

        selectedCategory = category;

        return categories;
    }

    /*
     * Change sub category
     *
     * If subcategory is unselected, main category becomes category selected
     */
    function selectSubCategory(categories, mainIndex, subIndex, category) {
        for(var i = 0; i < categories[mainIndex].subCategories.length; i++) {
                
            if(i == subIndex) {
                var toggle = true;

                // uncheck subcategory selection, select main category
                if(categories[mainIndex].subCategories[subIndex].checked) {
                    toggle = false
                    category = categories[mainIndex].value;
                }
               
                categories[mainIndex].subCategories[subIndex].checked = toggle;
            }
            else {
                categories[mainIndex].subCategories[i].checked = false;
            }
        }

        selectedCategory = category;

        return categories;
    }


    function filterItems(type, search=null, UserInfo=null, retail=false) {
        try {
            var itemsToShow = [],
                similarItems = [],
                subsidiary,
                UserID,
                userIsRetailer = false,
                category = parseInt(type);

            if(UserInfo) {
                subsidiary = parseInt(UserInfo.subsidiary);
                userIsRetailer = [2, 1, 7].includes(parseInt(UserInfo.category));
                UserID = UserInfo.id;
            }
            else {
                subsidiary = 2;
                userIsRetailer = false;
            }

            if(search) {
                search = search.toLowerCase();
            }

            if(retail) {
                category = 0;
            }


            for (var i = 0, length = items.length; i < length; i++)
            {
                var containsSearchTerm = false;
                var Name = items[i].Name ? items[i].Name : '';
                var styleRec = items[i].styleRec ? items[i].styleRec : '';
                var searchTags = items[i].searchTags ? items[i].searchTags : '';
                var Description = items[i].Description ? items[i].Description : '';
                var PartNum = items[i].partNum ? items[i].partNum : '';
                var beerStyles = items[i].beerStylesSearch ? items[i].beerStylesSearch : '';

                if(Utils.warehouseMatch(items[i].warehouse, subsidiary) && (!SalesLib.POSItems.includes(items[i].volID[0]) || (SalesLib.POSItems.includes(items[i].volID[0]) && userIsRetailer)))
                {
                    if(UserID)
                    {
                        if(!items[i].IsPrivate[0] || items[i].IsPrivate.indexOf(UserID) >= 0)
                        {
                            if(search)
                            {
                                if(Name.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(styleRec.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(searchTags.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(Description.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(PartNum.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }
                                else if(beerStyles.toLowerCase().includes(search))
                                {
                                    containsSearchTerm = true;
                                }


                                if(containsSearchTerm)
                                {
                                    if(SalesLib.SALESCATEGORY[category].indexOf(items[i].salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                                    {
                                        itemsToShow.push(items[i]);
                                    }
                                    else if(!retail)
                                    {
                                        similarItems.push(items[i]);
                                    }
                                }
                            }
                            else if(SalesLib.SALESCATEGORY[category].indexOf(items[i].salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                            {
                                itemsToShow.push(items[i]);
                            }
                        }
                    }
                    else if(!items[i].IsPrivate[0])
                    {
                        if(search)
                        {
                            if(Name.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(styleRec.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(searchTags.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(Description.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(PartNum.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(beerStyles.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }

                            if(containsSearchTerm)
                            {
                                if(SalesLib.SALESCATEGORY[category].indexOf(items[i].salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                                {
                                    itemsToShow.push(items[i]);
                                }
                                else if(!retail)
                                {
                                    similarItems.push(items[i]);
                                }
                            }
                        }
                        else if(SalesLib.SALESCATEGORY[category].indexOf(items[i].salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                        {
                            itemsToShow.push(items[i]);
                        }
                    }
                }
            }

            var finalResult = sortItems(itemsToShow);
            console.log('finalResult', finalResult);

            if(similarItems.length > 0)
            {
                finalResult.push('altresult');
                finalResult = finalResult.concat(similarItems);
            }

            return finalResult;
        }
        catch(err)
        {
            throw err;
        }
    }

    function sortItems(items)
    {
        try
        {
            return items.sort(function(item1, item2)
            {
                if(item1.Name.includes("WLP") && item2.Name.includes("WLP"))
                {
                    return item1.Name.slice(3).localeCompare(item2.Name.slice(3));
                }
                else if(item1.Name.includes("WLP"))
                {
                    return -1;
                }
                else if(item2.Name.includes("WLP"))
                {
                    return 1;
                }
                else
                {
                    return item1.Name.localeCompare(item2.Name);
                }
            });
        }
        catch(err)
        {
            throw {message: 'could not sort items', code: -1}
        }
    }

    return {
        getSelectedCategory: getSelectedCategory,
        getItems: getItems,
        addItems: addItems,
        getClassFilters: getClassFilters,
        addCategoriesLoaded: addCategoriesLoaded,
        selectMainCategory: selectMainCategory,
        selectSubCategory: selectSubCategory,
        filterItems: filterItems
    }

})();

export default Store;