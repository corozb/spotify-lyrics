import { useState, useEffect } from 'react'
import axios from 'axios'

export const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expriresIn, setExpriresIn] = useState()

  console.log(refreshToken)

  useEffect(() => {
    axios
      .post('http://localhost:3001/login', {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpriresIn(res.data.expriresIn)
        window.history.pushState({}, null, '/') // clean url
      })
      .catch(() => {
        window.location = '/'
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expriresIn) return
    const interval = setInterval(() => {
      axios
        .post('http://localhost:3001/refresh', {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken)
          setExpriresIn(res.data.expriresIn)
        })
        .catch(() => {
          window.location = '/'
        })
    }, (expriresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expriresIn])

  return accessToken
}
