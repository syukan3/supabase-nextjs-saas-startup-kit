import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // リクエストボディからフィードバック内容を取得
        const { feedbackType, feedbackText } = await request.json()

        // DBにINSERT
        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: session.user.id,
                feedback_type: feedbackType,
                content: feedbackText,
            })

        if (error) {
            console.error('[Feedback Insert Error]', error)
            return NextResponse.json({ error: 'Failed to insert feedback' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Feedback created successfully' })
    } catch (error) {
        console.error('[Feedback API Error]', error)
        return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }
}
