import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apipaths'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import moment from 'moment'
import AvatarGroup from '../../components/AvatarGroup'
import { LuSquareArrowOutUpLeft } from 'react-icons/lu'



const ViewTaskDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const adminId = localStorage.getItem("adminId")

  const getStatusColor = (status) => {
    const colors = {
      "In Progress": "bg-blue-100 text-blue-800",
      "Completed": "bg-green-100 text-green-800",
      "default": "bg-purple-100 text-purple-800"
    }
    return colors[status] || colors.default
  }

  const fetchTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id))
      if (response.data) setTask(response.data)
    } catch (error) {
      console.error("Error fetching task:", error)
    }
  }

  const toggleTodoItem = async (index) => {
    const todoList = [...(task?.todoChecklist || [])]
    if (todoList[index]) {
      todoList[index].completed = !todoList[index].completed
      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
          { todoChecklist: todoList }
        )
        if (response.status === 200) {
          setTask(response.data?.task || task)
        } else {
          todoList[index].completed = !todoList[index].completed
        }
      } catch (error) {
        console.error(error)
        todoList[index].completed = !todoList[index].completed
      }
    }
  }

  const openLink = (link) => {
    const url = /^https?:\/\//i.test(link) ? link : `https://${link}`
    window.open(url, "_blank")
  }

  useEffect(() => {
    if (id) fetchTaskDetails()
  }, [id])

  if (!task) return null

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className="p-4">
        {/* Task Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl">
          {/* Task Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{task.description}</p>
            </div>

            {/* Task Info */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <p className="font-medium text-gray-900">{task.priority}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="font-medium text-gray-900">
                    {task.dueDate ? moment(task.dueDate).format("Do MMM YYYY") : 'Not Set'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="mt-2">
                  <AvatarGroup 
                    avatars={task.assignedTo?.map(member => member?.profileImageUrl) || []} 
                    maxVisible={5} 
                  />
                </div>
              </div>
            </div>

            {/* Todo Checklist */}
            {task.todoChecklist?.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4">Todo Checklist</h3>
                <div className="space-y-2">
                  {task.todoChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => toggleTodoItem(idx)}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                      />
                      <span className={`${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments?.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="space-y-2">
                  {task.attachments.map((link, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => openLink(link)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-sm text-gray-900">{link}</span>
                      </div>
                      <LuSquareArrowOutUpLeft className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails