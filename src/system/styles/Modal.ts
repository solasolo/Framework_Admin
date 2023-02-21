export default {
    Dialog: {
        border: "none",
        borderRadius: "6px",
    },

    Header: {
        borderBottom: "1px solid #eee",
        marginBottom: "16px",
        paddingTop: "4px",
        paddingBottom: "4px",
    },

    Mask: (show: boolean) => {
        return {
            display: show ? "block" : "none",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
        };
    }
};