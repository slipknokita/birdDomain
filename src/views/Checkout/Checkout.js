import { useState, useEffect } from 'react';
import axios from "axios";
import {Button, Modal} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import "./Checkout.css";
import { ToastContainer, toast } from 'react-toastify';

const Checkout =()=>{
    const [products, setProducts] = useState([]);
    const [cartList, setCart] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleOnChange = (e) => {
        const {name, value} = e.target;
    }
    useEffect(()=>{
        const getBuys = async ()=>{
            await axios.get(`http://localhost:5000/usuarios/1`)
            .then(response =>{
                setProducts(response.data.buys)                            
            });
        }
        getBuys();
    },[])

    const deleteProduct = async (e)=>{
        const newProducts = products.filter(product => product.id !== Number(e.target.id));
        setProducts(newProducts);
        await axios.patch(`http://localhost:5000/usuarios/1`, {buys:newProducts});
    };
    function buyListOnOff(){
        setCart(!cartList);
    }
    function addTotalPrice(){
        let total=0;
        let i = 0;
        for(i=0;i<products.length;i++){
            total+=products[i].price
        }
        return(total)
    }
    function checkPay(e){
        e.preventDefault();
        const formPayCard = document.getElementById("formPayCard");
        const cardOwner = document.getElementById("cardOwner").value.trim();
        const cardNumbers = new Number(document.getElementById("cardNumbers").value.trim());
        const expireDate = document.getElementById("expireDate").value;
        const cvc = document.getElementById("cvc").value.trim();
        let time= new Date();
        let nowTime = (time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate());
        if((cardNumbers.toString().length)==16&&cardOwner!=""&& expireDate>nowTime && (cvc.toString().length)==3){    
                formPayCard.reset();
                setShow(true);
                deleteBuys()
        }else {
            toast("Oh! Parece que hubo un problema con tus datos, verifica tus datos y vuelve a intentarlo. Si el problema persiste ponde en contacto con nosotros para facilitarte otro medio de pago.", {
                type: "error",
                position: "top-center",
                autoClose: 10000
            });
        }
    }
    async function deleteBuys(){
        await axios.patch(`http://localhost:5000/usuarios/1`, {buys:[]});
    }
    return (
        <>
        <ToastContainer />
            <div>
                <Modal id="modalSuccess"show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="bg-modal text-black">
                        <Modal.Title>Compra Exitosa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-modal">Tu compra a finalizado con exito, nos estaremos poniendo en contacto con ustedes el proximo día habil de realiaza la compra. Muchas Gracias!</Modal.Body>
                    <Modal.Footer className="bg-modal">
                        <Link to="/">
                            <Button variant="success" onClick={handleClose}>Volver al Home</Button>
                        </Link>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>                 
                    </Modal.Footer>
                </Modal>
            </div>
            <div className="container my-4">
                <h1>Finalizar Compras</h1>
                <p>Una vez finalizada la compra, recueda con nos pondremos en contacto con usted a travez de tu email de registro para acordar los detalles de los Tours</p>
            </div>
            <button className="btn btn-warning"onClick={buyListOnOff}>Tu lista de compras</button>
            { cartList===false?null:
                <div className="px-2">
                    {
                        products.length === 0 ? <p className="my-2">No hay productos</p> : (
                            products.map((product, index) => 
                                <div key={index} className="d-flex justify-content-center my-3">
                                    <div >
                                        <p className="priceProduct" value={product.price}>{product.title} - {product.price}U$D</p>
                                    </div>
                                    <div>
                                        <i id={product.id} className="fas fa-trash ml-4" onClick={deleteProduct}></i>                                           
                                    </div>                                                                 
                                </div>
                            )                             
                        )                          
                    }
                    <div className="d-flex justify-content-center mb-4">
                        <div className="d-flex justify-content-center">
                            <p className="mt-2"><b>Total: {addTotalPrice()}U$D</b></p>
                        </div>
                    </div>
                </div>
            }
            <div className="container my-4">
                <h3>Datos de la tarjeta</h3>
                <form id="formPayCard">
                    <div className="form-group container my-4">
                        <label>Nombre del Titular</label>
                        <input id="cardOwner" name="cardOwner" onChange={handleOnChange} type="text" placeholder="Ej: Cosme Fulanito" className="form-control"></input>
                        <small className="form-text text-muted">Escribir el nombre completo como aparesca en su tarjeta de credito.</small>
                    </div>
                    <div className="form-group container my-4">
                        <label>Numero completo de la tarjeta de credido</label>
                        <input id="cardNumbers" name="cardNumbers" onChange={handleOnChange} type="number" placeholder="xxxx-xxxx-xxxx" className="form-control" required minLength="16"></input>
                    </div>
                    <div className="form-group d-flex justify-content-around my-4">
                        <div>
                            <label>Fecha de vencimiento</label>
                            <input id="expireDate" name="expireDate"onChange={handleOnChange} type="date" className="form-control"></input>
                        </div>
                        <div>
                            <label>Codigo de de seguridad posterior</label>
                            <input id="cvc" name="cvc" type="number" onChange={handleOnChange} placeholder="XXX" className="form-control"></input>
                            <small className="form-text text-muted">Codigo de tres digitos en el reverso de su tarjeta.</small>
                        </div>
                    </div>
                    <div className="form-group">
                        <button id="payBtn" type="submit" className="btn btn-success" onClick={checkPay}><strong>Pagar: {addTotalPrice()} U$D</strong></button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Checkout;