import { useNavigate } from "react-router-dom";

const InventoryHome = () => {

    const navigate = useNavigate();

    return(
        <div>
            <button onClick={() => navigate("/admin/dashboard/admin/inventory/create-reel")}>Create Reel</button>
        </div>
    )
}

export default InventoryHome;