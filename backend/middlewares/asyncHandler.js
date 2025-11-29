const asyncHandler  = (fu) =>(req,res,next) => {
    Promise.resolve(fu(req,res,next)).catch((error) => next(error));
}

export default asyncHandler;