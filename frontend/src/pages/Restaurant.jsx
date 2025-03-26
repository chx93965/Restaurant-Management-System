import { useParams } from 'react-router-dom';

const Restaurant = () => {
    const { restaurantId } = useParams();
    return (
        <div>
            <h1>Restaurant {restaurantId}</h1>
            <Menu restaurantId={restaurantId} />
        </div>
    );
};

export default Restaurant;

