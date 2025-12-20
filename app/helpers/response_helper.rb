# frozen_string_literal: true

module ResponseHelper
  SUCCESS_STATUS  = :ok
  ERROR_STATUS    = :fail
  SUCCESS_MESSAGE = 'Success'

  def json_with_success(message: SUCCESS_MESSAGE, data: nil, default_serializer: false, options: {})
    response = {
      status: SUCCESS_STATUS,
      message: message
    }
    unless default_serializer
      response[:data] = data
      return response
    end
    instance_options = options[:serialize] ? options[:serialize] : {}
    serializer_options = { include: '**' }
    serializer_options[:scope] = options[:scope] if options[:scope]
    response[:data] = ActiveModelSerializers::SerializableResource.new(data, instance_options.merge(serializer_options)).as_json
    response
  end

  def json_with_empty_success(message: SUCCESS_MESSAGE)
    {
      status:  SUCCESS_STATUS,
      message: message,
      data:    nil
    }
  end

  def json_with_error(message: :fail, errors: nil, code: nil)
    {
      status: ERROR_STATUS,
      message: message,
      errors: errors,
      error_code: code
    }
  end

end
