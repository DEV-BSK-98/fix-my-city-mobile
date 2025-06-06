export function formatMemberSinceDate (dataString) {
    const date = new Date (dataString)
    const month = date.toLocaleString ("default", {month: "short"})
    const year = date.getFullYear ()
    return `${month} ${year}`
}

export function formatMemberPublishedDate (dataString) {
    const date = new Date (dataString)
    const month = date.toLocaleString ("default", {month: "long"})
    const day = date.getDate ()
    const year = date.getFullYear ()
    return `${month} ${day}, ${year}`
}

export const sleep = (ms) => new Promise ((resolve) => setTimeout (resolve, ms))