import mongoose from "mongoose";

export function ownerOrAdminMiddleware(req, res, next) {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "A valid user ID is required" });
    }

    const isOwner = String(req.user.id) === String(id);
    const isAdmin = req.user.isAdmin === true;

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            message: "Forbidden: You do not have access to this account."
        });
    }

    next();
}