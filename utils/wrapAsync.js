//wrapAsync kya karta hai
//Ye function ek wrapper/helper hai jo yehi try-catch ka kaam automatically kar deta hai, taaki tumhe baar baar likhna na pade:
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};