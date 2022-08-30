class ApiFeatures{
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",  //Case insenstitive
            },
        } : {};
        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};   //If we change anything of queryCopy then it'll not change the original queryStr
        // console.log(queryCopy);
        
        //Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        
        removeFields.forEach(key=>delete queryCopy[key]) //if there is any of these ["keyword", "page", "limit"] in queryCopy array then it'll automatically delete those
        // console.log(queryCopy);
        
        //Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)        //TO give a '$' sign before (gt||gte||lt||lte)
        
        this.query = this.query.find(JSON.parse(queryStr));            //'this.query' means Product.find
        // console.log(queryStr);
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number (this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1)  //It'll leave 'skip' number of products from first 

        this.query = this.query.limit(resultPerPage).skip(skip);    //After skipping 'skip' number of items from first then it'll show 'resultPerPage' number of items in the current page

        return this;
    }
}

module.exports = ApiFeatures;