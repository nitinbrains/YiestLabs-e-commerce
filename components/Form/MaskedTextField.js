import React from "react";
import Cleave from "cleave.js/react";
require('cleave.js/dist/addons/cleave-phone.i18n.js');

const MaskedTextField=({ options, inputRef, ...other }) => {
    return <Cleave {...other} ref={inputRef} options={options} />;
}

export default MaskedTextField;