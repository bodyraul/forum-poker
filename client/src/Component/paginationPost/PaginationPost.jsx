import React from 'react'
import "./pagination.css"

export default function PaginationPost({postsPerPage,totalPosts,paginate}) {

    const pageNumbers = [];
    for (let index = 1; index <= Math.ceil(totalPosts/postsPerPage); index++) {
        pageNumbers.push(index);
        
    }

  return (
    <div className='partiePagination'>
        {pageNumbers.map(number=>{
            return(
                <button onClick={()=>paginate(number)} key={number}>{number}</button>
            )
        })}
    </div>
  )
}
