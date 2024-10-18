import React, { useEffect, useState } from "react"
import { useAuth } from "../../auth";
import "./index.css";
import { getToPathname } from "@remix-run/router";
import { toast } from 'react-toastify';
import Footer from '../../components/Footer';

function Cart({ profile, priceICP, priceBTC, priceETH, setCartItemsCount }) {
    const { backendActor } = useAuth();
    const [products, setProducts] = useState(null);

    useEffect(() => { if (profile && profile.name) { getShoppingCart() } }, []);

    const getShoppingCart = async () => {
        if (backendActor) {
            let response = await backendActor.getShoppingCart(profile.name);
            setProducts(response)
            console.log("shopping cart for ", response)
            let response2 = await backendActor.getCartItemsNumber(profile.name);
            console.log("cart number ", response2)
            setCartItemsCount(response2);
        }
    }

    const buyWithICP = async () => {
        const total = products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price)), 0);
        let response = await backendActor.convertUSDto("ICP-USD", total);
        const balance = await window.ic?.plug?.requestBalance();
        const tokenBalance = balance.find(item => item.symbol === "ICP");
        const tokenValue = tokenBalance ? tokenBalance.amount : null;
        if (tokenValue >= response) {
            const amount = (response * 100000000).toFixed(0);
            const requestTransferArg = {
                to: 'am7jk-7ly4w-dh262-wtu6h-hmlvh-toclt-xpdqr-s32cx-44buf-hoy5c-jqe',
                fee: 0,
                from_subaccount: [],
                created_at_time: [],
                amount: Number(amount),
            };
            await window.ic?.plug?.requestTransfer(requestTransferArg)
                .then(transfer => {
                    console.log('Transfer successful:', transfer);
                    createOrder("ICP", String(transfer.height));
                })
                .catch(error => {
                    if (String(error).includes("Error: The transaction was rejected.")) {
                        toast.error("The transaction was declined/rejected");
                    }
                });
        } else {
            toast.warning("You don't have enough balance!");
        }
    }

    const buyWithBTC = async () => {
        const total = products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price)), 0);
        //let response = await backendActor.convertUSDto("BTC-USD", total);
        //const balance = await window.ic?.plug?.requestBalance();
        //const tokenBalance = balance.find(item => item.symbol === "BTC");
        //const tokenValue = tokenBalance ? tokenBalance.amount : null;
        //if (tokenValue >= response) {
        //const amount = (response * 100000000).toFixed(0);
        const requestTransferArg = {
            to: 'am7jk-7ly4w-dh262-wtu6h-hmlvh-toclt-xpdqr-s32cx-44buf-hoy5c-jqe',
            //fee: Number(0),
            //token: 'mc6ru-gyaaa-aaaar-qaaaq-cai', // mxzaz-hqaaa-aaaar-qaada-cai ckbtc
            //symbol: 'ckBTC',
            amount: (Number(1000)),
            token: {
                icon: '',
                token: 'mxzaz-hqaaa-aaaar-qaada-cai',
                symbol: 'ckBTC',
                amount: (Number(1000)),
                canisterId: 'mxzaz-hqaaa-aaaar-qaada-cai',
                usdValue: (Number(100000000)),
                value: (Number(100000000)),
            }
            /*
            token: {
                token: 'mc6ru-gyaaa-aaaar-qaaaq-cai',
                symbol: 'ckTESTBTC',
                canisterId: 'mc6ru-gyaaa-aaaar-qaaaq-cai',
                name: 'Chain key testnet Bitcoin',
                //usdValue: (Number(100000000)),
            },
            from_subaccount: [],
            created_at_time: [],
            memo: { standard: "EXT" },
            amount: (Number(amount)),
            */
        };

        await window.ic?.plug?.requestTransfer(requestTransferArg)
            .then(transfer => {
                console.log('Transfer successful:', transfer);
                createOrder("ckBTC", String(transfer.height));
            })
            .catch(error => {
                if (String(error).includes("Error: The transaction was rejected.")) {
                    toast.error("The transaction was declined/rejected");
                }
            });
        // else {
        //    toast.warning("You don't have enough balance!");
        //}
    }

    const buyWithETH = async () => {
        const total = products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price)), 0);
        let response = await backendActor.convertUSDto("ETH-USD", total);
        const balance = await window.ic?.plug?.requestBalance();
        const tokenBalance = balance.find(item => item.symbol === "ETH");
        const tokenValue = tokenBalance ? tokenBalance.amount : null;
        if (tokenValue >= response) {
            let amount = (response * 100000000).toFixed(0);
            const requestTransferArg = {
                to: 'am7jk-7ly4w-dh262-wtu6h-hmlvh-toclt-xpdqr-s32cx-44buf-hoy5c-jqe',
                fee: 0,
                token: {
                    token: 'ss2fx-dyaaa-aaaar-qacoq-cai',
                    symbol: 'ckETH',
                    value: priceETH,
                },
                from_subaccount: [],
                created_at_time: [],
                amount: (Number(amount)),
            };
            await window.ic?.plug?.requestTransfer(requestTransferArg)
                .then(transfer => {
                    console.log('Transfer successful:', transfer);
                    createOrder("ckETH", String(transfer.height));
                })
                .catch(error => {
                    if (String(error).includes("Error: The transaction was rejected.")) {
                        toast.error("The transaction was declined/rejected");
                    }
                });
        } else {
            toast.warning("You don't have enough balance!");
        }
    }

    const buyWith = async (symbol) => {
        const total = products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price)), 0);
        let symbolFind = symbol + "-USD";
        let response = await backendActor.convertUSDto(symbolFind, total);
        const balance = await window.ic?.plug?.requestBalance();
        var symbolBalance = symbol;
        var canisterId;

        if (symbol === "BTC") {
            symbolBalance = "ck" + symbol;
            canisterId = 'mxzaz-hqaaa-aaaar-qaada-cai';
        }
        if (symbol === "ETH") {
            symbolBalance = "ck" + symbol;
            canisterId = 'ss2fx-dyaaa-aaaar-qacoq-cai';
        }

        const tokenBalance = balance.find(item => item.symbol === symbolBalance);
        const tokenValue = tokenBalance ? tokenBalance.amount : null;
        if (tokenValue >= response) {
            const ownerPrincipalWallet = 'am7jk-7ly4w-dh262-wtu6h-hmlvh-toclt-xpdqr-s32cx-44buf-hoy5c-jqe';
            const requestTransferArg = {
                to: ownerPrincipalWallet,
                strAmount: String(response.toFixed(6)),
            };

            if (canisterId) {
                requestTransferArg.token = canisterId;
                console.log('requestTransferArg', requestTransferArg)
                await window.ic.plug.requestTransferToken(requestTransferArg)
                    .then(transfer => {
                        console.log('transfer', transfer);
                        createOrder(symbolBalance, String(transfer.height));
                    })
                    .catch(error => {
                        if (String(error).includes("Error: The transaction was rejected.")) {
                            toast.error("The transaction was declined/rejected");
                        }
                    });
            } else {
                await window.ic.plug.requestTransfer(requestTransferArg)
                    .then(transfer => {
                        console.log('transfer', transfer);
                        createOrder(symbolBalance, String(transfer.height));
                    })
                    .catch(error => {
                        if (String(error).includes("Error: The transaction was rejected.")) {
                            toast.error("The transaction was declined/rejected");
                        }
                    });
            }
        } else {
            toast.warning("You don't have enough " + symbolBalance + " balance!");
        }
    }


    const createOrder = async (symbol, transfer) => {
        let response = await backendActor.createOrder(profile.name, products, symbol, transfer);
        //console.log("order created ", response);
        toast.success("Order Created!");
        getShoppingCart()
    };

    const deleteCartProduct = async (productId) => {
        let response = await backendActor.deleteCartProduct(Number(productId), profile.name);
        //console.log("delete cart product", response);
        toast.success("Product deleted!");
        getShoppingCart()
    };

    const addQuantityCartProduct = async (productId) => {
        let response = await backendActor.addQuantityCartProduct(Number(productId), profile.name);
        //console.log("add quantity cart product", response);
        getShoppingCart()
    };

    const removeQuantityCartProduct = async (productId) => {
        let response = await backendActor.removeQuantityCartProduct(Number(productId), profile.name);
        //console.log("remove quantity cart product", response);
        getShoppingCart()
    };

    return (
        <>
            <div className="cartlist">
                <h2>Shopping Cart</h2>
                {profile && products && products.length > 0 ? (
                    <>
                        <div className="grid-header">
                            <div className="header-item">Product Name</div>
                            <div style={{ textAlign: 'center' }} className="header-item">Quantity</div>
                            <div className="header-item"></div>
                            <div style={{ textAlign: 'center' }} className="header-item">Subtotal</div>
                            <div className="header-item"></div>
                        </div>
                        {products.sort((a, b) => Number(a.id) - Number(b.id)).map(product => (
                            <div key={Number(product.id)} className="grid-item">
                                <div className="product-name">{product.name}</div>
                                <div style={{ textAlign: 'center' }} className="quantity">{Number(product.quantity)}</div>
                                <div className="quantity-controls">
                                    <button onClick={() => removeQuantityCartProduct(product.id)}>&#8722;</button>
                                    <button onClick={() => addQuantityCartProduct(product.id)}>&#43;</button>
                                </div>
                                <div style={{ textAlign: 'center' }} className="subtotal">${Number(product.quantity) * Number(product.price)}</div>
                                <div className="delete-button">
                                    <button onClick={() => deleteCartProduct(product.id)}>Delete Product</button>
                                </div>
                            </div>
                        ))}
                        <div className="total-container">
                            <h2 className="total-price">Total Price:
                                ${products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price)), 0)}
                            </h2>
                            <div className="buyButtons">
                                <button onClick={() => buyWith("ICP")} className="centered-button">
                                    <span>
                                        Buy with ICP&nbsp;
                                        {Number(products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price) / priceICP), 0)).toFixed(6)}
                                        &nbsp;<img src="ICPblack.png" width="25px" height="25px" alt="logo" />
                                    </span>
                                </button>
                                <button onClick={() => buyWith("BTC")} className="centered-button">
                                    <span>
                                        Buy with ckBTC&nbsp;
                                        {Number(products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price) / priceBTC), 0)).toFixed(6)}
                                        &nbsp;<img src="ckBTC.png" width="25px" height="25px" alt="logo" />
                                    </span>
                                </button>
                                <button onClick={() => buyWith("ETH")} className="centered-button">
                                    <span>
                                        Buy with ckETH&nbsp;
                                        {Number(products.reduce((total, product) => total + (Number(product.quantity) * Number(product.price) / priceETH), 0)).toFixed(6)}
                                        &nbsp;<img src="ckETH.png" width="25px" height="25px" alt="logo" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Shopping Cart is empty.</p>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Cart;
