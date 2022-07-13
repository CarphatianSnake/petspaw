import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getBreedsList, breedsSlice } from '../breedsSlice'

import '../breeds.scss'

const BreedsList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const breedsList = useSelector(getBreedsList) 
  const isBreedsLoaded = useSelector(state => state.breedsSlice.breedsStatus)

  const onBreedChoose = (e) => {
    const breedId = breedsList.filter(item => item.name === e.target.value)[0].id
    dispatch(breedsSlice.actions.breedName(e.target.value.toLowerCase()))
    dispatch(breedsSlice.actions.breedId(breedId))
    navigate(`../${breedId}`)
  }

  return (
    <select
      className='breeds-slct breeds'
      defaultValue='All breeds'
      onChange={onBreedChoose}>
        <option key="all-breads" value='All breeds'>All breeds</option>
        {isBreedsLoaded === 'loaded' ? breedsList.map(item => <option key={item.id} value={item.name}>{item.name}</option>) : null}
    </select>
  )
}

export default BreedsList;