import { createSlice, createEntityAdapter, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import useHttp from '../../hooks/useHttp';

const _apiBase = 'https://api.thecatapi.com/v1/';
const _apiKey = '?api_key=48590d6e-8781-4957-a99d-4ce5410ff12c';

const photoAdapter = createEntityAdapter();

const votesAdapter = createEntityAdapter();

const favsAdapter = createEntityAdapter();

const initialState = photoAdapter.getInitialState(
  {
    photoStatus: 'idle',
    votes: votesAdapter.getInitialState({
      votesStatus: 'idle'
    }),
    favs: favsAdapter.getInitialState({
      favsStatus: 'idle'
    })
  }
)

export const fetchPhoto = createAsyncThunk(
  'vSlice/fetchPhoto',
  () => {
    const {request} = useHttp();
    return request(`${_apiBase}images/search?page=0&limit=1&order=RANDOM&size=full${_apiKey}`);
  }
);

export const fetchVotes = createAsyncThunk(
  'vSlice/fetchVotes',
  () => {
    const {request} = useHttp();
    return request(`${_apiBase}votes${_apiKey}`);
  }
);

export const fetchFavs = createAsyncThunk(
  'vSlice/fetchFavs',
  () => {
    const {request} = useHttp();
    return request(`${_apiBase}favourites${_apiKey}`);
  }
);

const vSlice = createSlice({
  name: 'vSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPhoto.pending, state => {state.photoStatus = 'pending'})
      .addCase(fetchPhoto.fulfilled, (state, {payload}) => {
        state.photoStatus = 'loaded'
        photoAdapter.setAll(state, payload)
      })
      .addCase(fetchPhoto.rejected, state => {state.photoStatus = 'error'})
      .addCase(fetchVotes.pending, state => {state.votes.votesStatus = 'pending'})
      .addCase(fetchVotes.fulfilled, (state, {payload}) => {
        state.votes.votesStatus = 'loaded'
        votesAdapter.setAll(state.votes, payload)
      })
      .addCase(fetchVotes.rejected, state => {state.votes.votesStatus = 'error'})
      .addCase(fetchFavs.pending, state => {state.favs.votesStatus = 'pending'})
      .addCase(fetchFavs.fulfilled, (state, {payload}) => {
        state.favs.favsStatus = 'loaded'
        favsAdapter.setAll(state.favs, payload)
      })
      .addCase(fetchFavs.rejected, state => {state.favs.favsStatus = 'error'})
      .addDefaultCase(() => {})
  }
})

const {reducer} = vSlice;
export default reducer;

export const selectPhoto = photoAdapter.getSelectors(state => state.vSlice).selectAll;
export const selectVotes = votesAdapter.getSelectors(state => state.vSlice.votes).selectAll;
export const selectFavs = favsAdapter.getSelectors(state => state.vSlice.favs).selectAll;

export const getPhotoData = createSelector(
  state => state.vSlice.photoStatus,
  selectPhoto,
  (status, data) => {
    if (status === 'loaded') return data[0];
  }
)

export const getVotesData = createSelector(
  state => state.vSlice.votes.votesStatus,
  selectVotes,
  (status, data) => {
    if (status === 'loaded') return data;
  }
)

export const getFavsData = createSelector(
  state => state.vSlice.favs.favsStatus,
  selectFavs,
  (status, data) => {
    if (status === 'loaded') return data;
  }
)