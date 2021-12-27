import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfileFollowing() {
  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState([])
  const { username } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchFollowing() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, { cancelToken: ourRequest.token })
        setFollowing(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem")
      }
    }
    fetchFollowing()
    return () => {
      ourRequest.cancel()
    }
  }, [username])
  if (isLoading) return <LoadingDotsIcon />
  return (
    <div className="list-group">
      {following.map((user, index) => {
        return (
          <Link key={index} to={`/profile/${user.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={user.avatar} /> {user.username}
          </Link>
        )
      })}
    </div>
  )
}

export default ProfileFollowing
