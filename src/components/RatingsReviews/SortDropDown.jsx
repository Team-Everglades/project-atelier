import React, { useState } from 'react'

export default function SortDropDown({sort, setSort}) {


  const handleSortSelect = (evt) => {
    setSort(evt.target.text);
    const elem = document.activeElement;
    if(elem){
      elem?.blur();
    }
  };

  return (
    <span className="dropdown">
    <label tabIndex={0} className="font-bold text-decoration-underline">{sort} ↓</label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52" onClick={handleSortSelect}>
        <li><a>relevance</a></li>
        <li><a>most helpful</a></li>
        <li><a>most recent</a></li>
        </ul>
        </span>
  )
}