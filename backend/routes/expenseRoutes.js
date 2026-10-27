// Update an existing expense entry by ID
router.put('/:id', async (request, response) => {
  try {
    const updatedEntry = await ExpenseModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    
    if (!updatedEntry) {
      return response.status(404).json({ errorDetails: 'Record not found.' });
    }

    response.status(200).json(updatedEntry);
  } catch (error) {
    response.status(500).json({ errorDetails: 'Failed to update requested record.' });
  }
});