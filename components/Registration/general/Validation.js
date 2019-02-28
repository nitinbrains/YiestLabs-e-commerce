import _isEmpty from "lodash/isEmpty";
import * as yup from "yup";

export const errorBase = {
    required: {
        companyName: "Company name is Required",
        email: "Email is Required",
        phone: "Phone is Required",
        password: "Password is Required",
        confirmPassword: "Confirm password is Required",
        category: "Category is Required",
        orderFrom: "Order from is Required",
        acContact: "Accounting contact is Required",
        acPhone: "Accounting phone is Required"
    }
};

yup.match = function(key, message, func) {
    message = message || "Values do not match";
    func =
        func ||
        function(value) {
            return value === this.options.context[key];
        };

    return yup.mixed().test("match", message, func);
};

export const validationSchema = yup.object().shape({
    companyName: yup.string().required().typeError("Company name is required"),
    email: yup.string().email().required().typeError("Email is required"),
    phone: yup.string().required().typeError("Phone is required"),
    password: yup.string().min(8).required().typeError("Password is required"),
    confirmPassword: yup.string().required().typeError("Confirm Password is required"),
    category: yup.string().required().typeError("Category is required"),
    orderFrom: yup.string().required().typeError("Order From is required"),
    acContact: yup.string().required().typeError("Accounting Contact is required"),
    acPhone: yup.string().required().typeError("Accounting phone number is required")
});

export const validate = props => {
    const { values, setErrors } = props;
    try {
        const result = validationSchema.validateSync(values);
        console.log('result', result);
    } catch (error) {
        console.log('error', error);
        setErrors(error)
        return { error: error };
    }
};
