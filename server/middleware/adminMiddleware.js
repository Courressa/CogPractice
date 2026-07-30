export function adminMiddleware(req, res, next) {
    if (!req.userData?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access only" });
    }
    
    next();
};