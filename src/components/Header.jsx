export default function Header(props) {
    const {handleToggleMenu} = props
    return (
        <header>
            <button onClick={handleToggleMenu} aria-label className="open-nav-button">
            <i class="fa-solid fa-bars"></i>
            </button>
            <h1 className="text-gradient">Pokédex</h1>
        </header>
    )
}