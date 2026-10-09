export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => e.message).join('; ')
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: errorMessages,
      },
    })
  }
  req.body = result.data
  next()
}
