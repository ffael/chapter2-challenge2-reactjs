import { useState, useEffect } from 'react'

import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

import { FoodType } from '../../components/Food'

interface EditingFood {
  id: number | null
}

export function Dashboard() {

  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<EditingFood>({ id: null })
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods')
      setFoods(response.data)
    }

    getFoods()
  }, [foods])

  async function handleAddFood(food: FoodType) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: FoodType) {
    try {
      const updatedFood = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const updatedFoods = foods.map((single: FoodType) =>
        single.id !== updatedFood.data.id ? single : updatedFood.data
      )

      setFoods(updatedFoods)

    } catch (err) {
      console.log(err)
    }
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const filteredFoods = foods.filter((food) => food.id !== id)

    setFoods(filteredFoods)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}