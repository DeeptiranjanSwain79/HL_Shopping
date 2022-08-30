module.exports = thefunc => (req, res, next) => {
    Promise.resolve(thefunc(req, res, next)).catch(next);
}

//It gets the function and resolve it first, if it doesn't get any error then it works accordingly