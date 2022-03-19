import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSdkKey, createSdkKey } from "../actions/sdkKeyActions";

const SdkKeyPage = () => {
  const dispatch = useDispatch();
  const sdkKey = useSelector((state) => state.sdkKey);
  const warningMessage = `Are you sure you want to generate a new SDK Key?
Doing so will make the previous key invalid and you'll
need to update all instances of the SDK with the new key`;

  useEffect(() => {
    dispatch(fetchSdkKey());
  }, [dispatch]);

  const createNewSdkKey = (e) => {
    e.preventDefault();
    if (sdkKey) {
      if (window.confirm(warningMessage)) {
        dispatch(createSdkKey());
      }
    } else {
      dispatch(createSdkKey());
    }
  }

  return (
    <div className="w-full py-3 px-12">
      <h2 className="text-3xl font-bold text-primary-violet">Get an SDK Key</h2>
      {sdkKey && (
        <p className="text-xl">{sdkKey}</p>
      )}
      <button
        className="btn bg-primary-turquoise"
        type="button"
        onClick={createNewSdkKey}
      >
        Generate a new SDK Key
      </button>
    </div>
  )
}

export default SdkKeyPage;
