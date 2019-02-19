export const companyName = (value) => {
    let error;
    if (!value) {
        error = "Company name is Required";
    };
    return error;
};