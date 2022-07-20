import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { nanoid } from '@reduxjs/toolkit'

import SearchPanel from '../searchPanel/SearchPanel'
import PageNavigation from '../pageNavigation/PageNavigation'
import BreedsList from './breedsList/BreedsList'
import SortBtns from './sortBtns/SortBtns'
import PhotoGrid from '../photoGrid/PhotoGrid'
import Spinner from '../spinner'
import { fetchBreeds, breedsSlice, getBreedsList, breedsLimit } from './breedsSlice'
import { pageSlice } from '../photoGrid/pageSlice'
import store from "../store/store"

import './breeds.scss'

const Breeds = () => {

  const {getState} = store
  const dispatch = useDispatch()
  const limit = useSelector(state => state.breedsSlice.breedsLimit)
  const isBreedsLoaded = useSelector(state => state.breedsSlice.breedsStatus)
  const isBreedsReverse = useSelector(state => state.breedsSlice.breedsReverse)

  useEffect(() => {
    dispatch(fetchBreeds())
  })

  const makeBreedsArray = (arr, limit, isReverse) => {

    const tempArr = [...arr]

    if (isReverse) {
      tempArr.reverse()
    }

    const newArr = []
    for (let i = 0; i < Math.ceil(arr.length / limit); i++) {
      newArr.push(tempArr.splice(0, limit))
    }

    return newArr
  }

  const changeLimit = (e) => {
    dispatch(breedsLimit(e.target.value))
    dispatch(pageSlice.actions.pageRst())
  }

  const limitsSelect = (
    <select className='breeds-slct br-limit' onChange={(e) => {changeLimit(e)}}>
      {
        ['5', '10', '15', '20'].map(item => 
          item === limit ? 
            <option key={nanoid()} value={item} selected>Limit: {item}</option>
            :
            <option key={nanoid()} value={item}>Limit: {item}</option>)
      }
    </select>
  )

  return (
    <main>
      <SearchPanel />
      <section>

        <nav className='breeds-nav'>
          <PageNavigation />
          <BreedsList />
          {limitsSelect}
          <SortBtns />
        </nav>

        <div className='scroll-container'>
          {isBreedsLoaded === 'loaded' ?
            <PhotoGrid
              name='breeds'
              photos={makeBreedsArray(getBreedsList(getState()), limit, isBreedsReverse)}
            /> :
            <Spinner />}
        </div>

      </section>
    </main>
  )
}

export default Breeds;