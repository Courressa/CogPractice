export const getHealth = (req, res) => {
    try {
        res.status(200).json("Up and running~");
    } catch (error) {
        res.status(503).json("Service Unavailave: ", error.message);
    };
};