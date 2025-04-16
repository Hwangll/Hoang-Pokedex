import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu} = props

    const [searchValue, setSearchValue] = useState("");

    const filterPokemon = first151Pokemon.filter((element, elementIndex) => {
        // if full pokedex number includes the current search value 
        //return true
        if (getFullPokedexNumber(elementIndex).includes(searchValue)) {return true}
        // if the pokemon 
        if (element.toLowerCase().includes(searchValue.toLowerCase())) {return true}

        return false

    })


    return (
        <nav className={" " + (!showSideMenu ? " open" : " ")}>
            <div className={"header" + (!showSideMenu ? { open} : " ")}>
                <button onClick={handleCloseMenu} aria-label className="open-nav-button ">
                <i class="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>
            <input placeholder="Ví dụ: 001 hoặc là Bulba..." value={searchValue} onChange={(e) => {
                setSearchValue(e.target.value)

            }} />

            
            {filterPokemon.map((pokemon, pokemonIndex) => {
                const truePokemonIndex = first151Pokemon.indexOf(pokemon)
                return (
                    <button onClick={() => {
                        setSelectedPokemon(truePokemonIndex)
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card' + (pokemonIndex === selectedPokemon ? " nav-card-selected" : "")}  >
                        <p>{getFullPokedexNumber(truePokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}
