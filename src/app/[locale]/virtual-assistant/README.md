# Virtual Assistant Frontend Component

This component provides a user interface for testing the Virtual Assistant API. It allows users to interact with the AI-powered project matching system through a chat-like interface.

## Features

- **Chat Interface**: Real-time conversation with the Virtual Assistant
- **Membership Toggle**: Switch between active member and anonymous user
- **Session Management**: Automatic session ID generation and management
- **UI Components**: Dynamic rendering of project cards and paywall
- **Responsive Design**: Mobile-friendly interface
- **Internationalization**: Support for multiple languages (EN/PT/ES)

## Usage

### Accessing the Component

The Virtual Assistant is accessible through the navigation menu:
- Navigate to **Development** → **Virtual Assistant**
- Or directly visit: `/[locale]/virtual-assistant`

### Testing the System

1. **Membership Status Toggle**
   - Switch between "Active Member" and "Inactive/Anonymous"
   - This simulates different user types for testing

2. **Example Conversations**
   Try these example inputs:
   - "I need a React developer in New York"
   - "Looking for Python developers"
   - "Need someone in San Francisco"

3. **Flow Testing**
   - The assistant will ask for missing information
   - It will check your membership status
   - Active members see project cards
   - Inactive users see a paywall

## Component Structure

```
VirtualAssistant/
├── VirtualAssistant.tsx      # Main component
├── VirtualAssistant.module.css # Styling
├── page.tsx                  # Route page
├── loading.tsx               # Loading state
└── README.md                 # This file
```

## API Integration

The component communicates with the Virtual Assistant API at:
- **Endpoint**: `http://localhost:3001/va/message`
- **Method**: POST
- **Content-Type**: application/json

### Request Format
```json
{
  "sessionId": "uuid-string",
  "userId": "optional-user-id",
  "text": "user message",
  "locale": "en-US"
}
```

### Response Handling
The component handles three types of UI responses:
- **message**: Simple text response
- **cards**: Project listings with apply buttons
- **paywall**: Upgrade prompt for inactive users

## Styling

The component uses CSS modules with:
- Modern gradient designs
- Responsive layout
- Smooth animations
- PrimeReact component styling
- Mobile-first approach

## Dependencies

- **PrimeReact**: UI components (Card, Button, InputText, etc.)
- **Next.js**: Framework and routing
- **next-intl**: Internationalization
- **CSS Modules**: Scoped styling

## Development

### Adding New Features
1. Update the component logic in `VirtualAssistant.tsx`
2. Add new styles in `VirtualAssistant.module.css`
3. Update translation files if needed
4. Test with different membership states

### Customization
- Modify the chat interface styling
- Add new UI component types
- Extend the membership simulation
- Add more example conversations

## Testing Scenarios

### Happy Path (Active Member)
1. Toggle membership to "Active Member"
2. Send a message with stack and location
3. Verify project cards are displayed
4. Test apply button functionality

### Paywall Path (Inactive User)
1. Toggle membership to "Inactive/Anonymous"
2. Send a message with stack and location
3. Verify paywall is displayed
4. Test upgrade button functionality

### Error Handling
1. Test with invalid API responses
2. Verify error messages are displayed
3. Test network connectivity issues

## Troubleshooting

### Common Issues
1. **API Connection**: Ensure Virtual Assistant API is running on port 3001
2. **CORS**: Check if the API allows requests from the frontend
3. **Styling**: Verify PrimeReact components are properly imported
4. **Translations**: Check if all translation keys are defined

### Debug Information
- Session ID is displayed in the controls
- User ID shows current membership status
- Console logs show API communication details
- Network tab shows request/response details

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live chat
- **File Uploads**: Support for project attachments
- **Voice Input**: Speech-to-text integration
- **Analytics**: User interaction tracking
- **A/B Testing**: Different conversation flows
- **Integration**: Connect with real user management systems

