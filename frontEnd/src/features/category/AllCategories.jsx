import React from 'react'

function AllCategories({categories}) {
  return (
    <select>
        {
          categories.map((category) =>(
            <option  >{category.name}</option>
          ))
        }
    </select>
  )
}

export default AllCategories