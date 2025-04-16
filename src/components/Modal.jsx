import ReactDom from "react-dom"

export default function Modal(props) {
    const {children, hanldeCloseModal} = props
    return ReactDom.createPortal(
        <div className="modal-container" >
            <button aria-label onClick={hanldeCloseModal} className="modal-underlay"/>
            <div className="modal-content">
                {children}
            </div>

        </div>,
        document.getElementById('portal')
    )
}

