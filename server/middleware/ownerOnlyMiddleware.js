export function ownerOnlyMiddleware(req, res, next) {
    const id = req.params.id;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "A valid user ID is required" });
    }
    
    // Compare as strings since params.id deals with DB ObjectId so just incase it returns ObjectId
    // Avoid ObjectId vs string mismatch
    if (String(req.user.id) !== String(id)) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this account." });
    }
    
    next();
};