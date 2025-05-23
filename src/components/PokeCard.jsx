import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"
import Modal from "./Modal"

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)
    const { name, height, abilities, stats, moves, sprites, types } = data || {}
    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) {
            return false
        }
        if (['versions', 'other'].includes(val)) {
            return false
        }
        return true
    })

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl  ) {
            return
        }

        let cache = {}
        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }
        if (move in cache) {
            setSkill(cache[move])
            console.log('Found move on cache');
            return
        }

        try {
            setLoadingSkill(true);
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetching move from API', moveData);
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name = 'firered-leafgreen'
            })[0]?.flavor_text
            
            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            cache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache))
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingSkill(false)
        }

    }

    useEffect(() => {
        // if loading, exit logic 
        if (loading || !localStorage) {
            return
        }
        // check if the selected pokemon info is available in the app
        // 1. define the cache 
        let cache = {};
        if (localStorage.getItem('pokedex')) {
            console.log(selectedPokemon)
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }
        // 2. check if the selected pokemon is in the cache, otherwise fetch API pokemon 
        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache');
            
            return
        }
        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('fetching pokemon data');
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()
        // 3. if we fetch from api, make sure to save the information to the cache for next time  

    }, [selectedPokemon])

    if (loading) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }


    return (
        <div className="poke-card">
            {skill && (<Modal hanldeCloseModal={() => {
                setSkill(null);
            }} >
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h4> {getFullPokedexNumber(selectedPokemon)}</h4>
                <h2> {name} </h2>
            </div>

            <div className="type-container">
                {types?.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <div>
                <img className="default-img" src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"} alt={`${name}-large-img`} />
            </div>

            <div className="img-container">

                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>

            <div className="stats-card">
                {stats?.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex}>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves?.map((moveObj, moveIndex) => {
                    return (
                        <button key={moveIndex} className="button-card pokemon-move"
                            onClick={() => {
                                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                             }}
                        >
                            <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}