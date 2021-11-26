import React from 'react'

function Badge({color,text}) {
    return (
        <span className={`badge bg-${color} me-2`}>{text}</span>
    )
}

export default Badge
