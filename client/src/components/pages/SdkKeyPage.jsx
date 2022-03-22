import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { fetchSdkKey, createSdkKey } from "../../actions/sdkKeyActions";

const SdkKeyPage = () => {
  const dispatch = useDispatch();
  const sdkKey = useSelector((state) => state.sdkKey);
  const [copied, setCopied] = useState(false);
  const warningMessage = `Are you sure you want to generate a new SDK Key?
Doing so will make the previous key invalid and you'll
need to update all instances of the SDK with the new key`;

  useEffect(() => {
    dispatch(fetchSdkKey());
  }, [dispatch]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sdkKey);
    setCopied(true);
  };

  const createNewSdkKey = (e) => {
    e.preventDefault();
    if (sdkKey) {
      if (window.confirm(warningMessage)) {
        dispatch(createSdkKey());
      }
    } else {
      dispatch(createSdkKey());
    }
  };

  return (
    <div className="w-full p-12">
      <h2 className="text-3xl font-bold text-primary-violet">Get an SDK Key</h2>
      <div className="flex flex-col items-center">
        {sdkKey && (
          <div className="text-xl py-3 mt-8">
            <span className=" p-3 border-2 rounded-md bg-primary-offwhite">
              {sdkKey}
            </span>
            <button
              className="mx-3 p-3 rounded-lg bg-primary-offwhite text-primary-oxfordblue text-sm shadow-md active:bg-slate"
              onClick={handleCopy}
            >
              Copy
              <FontAwesomeIcon icon={faCopy} className="ml-2"/>
            </button>
            {copied && (
              <span className="text-sm text-primary-violet">Copied!</span>
            )}
          </div>
        )}
        <button
          className="btn bg-primary-turquoise my-8"
          type="button"
          onClick={createNewSdkKey}
        >
          Generate a new SDK Key
        </button>
      </div>
    </div>
  );
};

export default SdkKeyPage;
