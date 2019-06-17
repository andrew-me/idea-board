import React from 'react';

type OrderButtonProps = {
    onClick: () => void;
    text: string;
    active: boolean;
}

const OrderButton = (props: OrderButtonProps) => {
    if (props.active) {
        return(
            <span className="order-button order-button--active">{props.text}</span>
        );
    }

    return(
        <button className="order-button" onClick={props.onClick}>{props.text}</button>
    );
}

export default OrderButton;