import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { deleteMetric } from "../actions/metricActions";

const BUTTON_CSS = "text-primary-violet py-2 px-3 mr-2 hover:bg-primary-violet hover:text-primary-offwhite rounded-xl";

const MetricsItem = ({ id, name, query_string, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditMetric = () => {
    navigate(`/edit_metric/${id}`);
  };

  const handleDeleteMetric = () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      dispatch(deleteMetric(id));
    };
  };

  return (
    <div className="flex justify-between items-center border border-primary-black rounded my-5 p-5">
      <div>
        <p className="text-lg font-bold">{name}</p>
        <p>Type: {type}</p>
      </div>
      <div>
        <button
          onClick={handleEditMetric}
          className={BUTTON_CSS}
        >
          Edit
        </button>
        <button
          onClick={handleDeleteMetric}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default MetricsItem;
