import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "../styles/HomeView.module.css";
import useStore from '../store/store';
import api from '../js/App/Api';

function ManageView() {
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ManageView</h1>
    </div>
  );
}

export default ManageView;