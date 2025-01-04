import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Services/firebase";

const Products = () => {
  const [value, setValue] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", price: "", description: "", category: "" });

  const getDataFromFirebase = () => {
    getDocs(collection(db, "user"))
      .then((res) => setValue(res.docs.map((doc) => ({ id: doc.id, ...doc.data() }))))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getDataFromFirebase();
  }, []);

  // Handle Delete
  const handleDelete = (id) => {
    deleteDoc(doc(db, "user", id))
      .then(() => {
        setValue(value.filter((el) => el.id !== id));
        console.log("Document deleted successfully!");
      })
      .catch((err) => console.error(err));
  };

  // Handle Edit
  const handleEdit = (id) => {
    const product = value.find((el) => el.id === id);
    setEditId(id);
    setEditedData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  };

  const handleSave = (id) => {
    const docRef = doc(db, "user", id);
    updateDoc(docRef, editedData)
      .then(() => {
        setValue(value.map((el) => (el.id === id ? { ...el, ...editedData } : el)));
        setEditId(null);
        setEditedData({ name: "", price: "", description: "", category: "" });
        console.log("Document updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
      {value.map((el) => (
        <div
          key={el.id}
          style={{
            height: "550px",
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            margin: "16px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={el.image}
            alt={el.name}
            style={{
              width: "250px",
              height: "auto",
              borderRadius: "8px",
            }}
          />
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              margin: "8px 0",
            }}
          >
            {el.title}
          </p>

          {/* Editable Fields */}
          {editId === el.id ? (
            <>
              <input
                type="text"
                value={editedData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                style={{ width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "4px" }}
              />
              <input
                type="text"
                value={editedData.price}
                onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                style={{ width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "4px" }}
              />
              <textarea
                value={editedData.description}
                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                style={{ width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "4px" }}
              />
              <input
                type="text"
                value={editedData.category}
                onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                style={{ width: "100%", marginBottom: "8px", padding: "8px", borderRadius: "4px" }}
              />
              <button
                onClick={() => handleSave(el.id)}
                style={{
                  padding: "8px",
                  margin: "8px 4px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "8px 0",
                  color: "#333",
                }}
              >
                {el.name}
              </h1>
              <h2
                style={{
                  fontSize: "18px",
                  color: "#007bff",
                  margin: "8px 0",
                }}
              >
                {el.price}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: "8px 0",
                }}
              >
                {el.description}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#888",
                  margin: "8px 0",
                  fontStyle: "italic",
                }}
              >
                {el.category}
              </p>
              <button
                onClick={() => handleEdit(el.id)}
                style={{
                  padding: "8px",
                  margin: "8px 4px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(el.id)}
                style={{
                  padding: "8px",
                  margin: "8px 4px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Products;
