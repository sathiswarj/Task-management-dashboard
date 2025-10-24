import { useState, useEffect } from 'react';
import AddPopup from './AddPopup';
import { ApiGetRequset } from '../data/ApiGetRequest';
import { Pen, Trash } from 'lucide-react';
import EditPopup from './EditPopup';
import { ApiPostRequest } from '../data/ApiPostRequest';
const Home = () => {
  const [addPopup, setAddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedAssignee, setSelectedAssignee] = useState('All Assignees');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedType, setSelectedType] = useState('All Types');

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiGetRequset.getAllTasks();
      if (response.success === true) {
        setData(response.data || []);
      }
    } catch (error) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleClose = () => {
    setAddPopup(!addPopup);
    handleFetch(); 
  };

  const handleEditClose = () => {
    setEditPopup(false);
    setSelectedTask(null);
    handleFetch();
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditPopup(true);
  };
 

const handleDelete = async (taskId) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      await ApiPostRequest.deleteTask(taskId);
      setData(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
      alert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  }
};
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProject('All Projects');
    setSelectedAssignee('All Assignees');
    setSelectedStatus('All Statuses');
    setSelectedType('All Types');
  };

  const filteredData = data.filter((task) => {
    const matchesSearch = task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'All Projects' || task.project === selectedProject;
    const matchesAssignee = selectedAssignee === 'All Assignees' || task.taskAssignee === selectedAssignee;
    const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus;
    const matchesType = selectedType === 'All Types' || task.taskType === selectedType;

    return matchesSearch && matchesProject && matchesAssignee && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'bg-gray-200 text-gray-800';
      case 'In Progress': return 'bg-blue-200 text-blue-800';
      case 'Review': return 'bg-yellow-200 text-yellow-800';
      case 'Done': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-200 text-red-800';
      case 'Medium': return 'bg-orange-200 text-orange-800';
      case 'Low': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <main className="flex flex-col p-6">
        <div className="flex justify-between items-center shadow-md border border-2 p-10 rounded">
          <p className="text-black font-bold text-2xl">Task Management Dashboard</p>
          <button
            className="text-white bg-blue-500 px-5 py-3 rounded hover:bg-blue-600 transition"
            onClick={() => setAddPopup(!addPopup)}
          >
            + Create Task
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-5 shadow-md border border-2 p-10 mt-5 rounded">
          <input
            type="text"
            placeholder="Search tasks ..."
            className="border border-1 p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select 
            name="projects" 
            className="border border-2 p-2 rounded"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option>All Projects</option>
            <option>E-commerce Platform</option>
            <option>Mobile App</option>
            <option>Analytics Dashboard</option>
          </select>

          <select 
            name="assignees" 
            className="border border-2 p-2 rounded"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
          >
            <option>All Assignees</option>
            <option>John Doe</option>
            <option>John Smith</option>
            <option>Mike Johnson</option>
            <option>Sarah Willson</option>
          </select>

          <select 
            name="status" 
            className="border border-2 p-2 rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>Done</option>
          </select>

          <select 
            name="types" 
            className="border border-2 p-2 rounded"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option>All Types</option>
            <option>Bug</option>
            <option>Feature</option>
            <option>Enhancement</option>
            <option>Research</option>
          </select>

          <button 
            className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-5">
          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">Loading tasks...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-10">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={handleFetch}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && filteredData.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No tasks found</p>
            </div>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredData.map((task) => (
                <div 
                  key={task._id || task.taskId} 
                  className="border border-2 rounded-lg p-5 shadow-md hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3 max-w-md">
                    <div className='flex flex-row gap-2 items-center'>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.taskPriority)}`}>
                        {task.taskPriority}
                      </span>
                      
                    <div className="flex items-center gap-2">
                       <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                      <button 
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                        title="Edit task"
                      >
                        <Pen size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(task.taskId)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                        title="Delete task"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                      <h3 className="font-bold text-lg text-gray-800">{task.name}</h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Type:</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {task.taskType}
                      </span>
                    </div>

 

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Assignee:</span>
                      <span className="text-xs text-gray-700">{task.taskAssignee}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Due Date:</span>
                      <span className="text-xs text-gray-700">{formatDate(task.taskDueDate)}</span>
                    </div>
                  </div>

                   
                </div>
              ))}
            </div>
          )}
        </div>

        {addPopup && <AddPopup onClose={handleClose} />}
        {editPopup && <EditPopup onClose={handleEditClose} taskData={selectedTask} isEdit={true} />}
      </main>
    </>
  );
};

export default Home;